# blog/tests.py
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Article
from .forms import ArticleForm
from rest_framework.test import APIClient
from rest_framework import status


# Тесты для модели Article
class ArticleModelTest(TestCase):
    def setUp(self):
        self.article = Article.objects.create(
            title="Test Article",
            content="This is a test article."
        )

    def test_article_creation(self):
        self.assertEqual(self.article.title, "Test Article")
        self.assertEqual(self.article.content, "This is a test article.")
        self.assertTrue(isinstance(self.article, Article))
        self.assertEqual(str(self.article), self.article.title)


# Тесты для формы ArticleForm
class ArticleFormTest(TestCase):
    def test_valid_form(self):
        data = {
            'title': 'Test Article',
            'content': 'This is a test article.',
        }
        form = ArticleForm(data=data)
        self.assertTrue(form.is_valid())

    def test_invalid_form(self):
        data = {
            'title': '',  # Неверное значение (пустое поле)
            'content': 'This is a test article.',
        }
        form = ArticleForm(data=data)
        self.assertFalse(form.is_valid())
        self.assertEqual(len(form.errors), 1)


# Тесты для API
class ArticleAPITest(TestCase):
    def setUp(self):
        # Создание пользователя и авторизация
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client = APIClient()
        self.client.login(username='testuser', password='password')

        # Создаем статью для тестов
        self.article = Article.objects.create(title="Test Article", content="Test content")
        self.article_url = reverse('article-detail', kwargs={'pk': self.article.pk})

    def test_get_article(self):
        response = self.client.get(self.article_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.article.title)

    def test_create_article(self):
        data = {
            'title': 'New Article',
            'content': 'New article content',
        }
        response = self.client.post(reverse('article-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_article(self):
        data = {
            'title': 'Updated Article',
            'content': 'Updated content',
        }
        response = self.client.put(self.article_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Article')

    def test_delete_article(self):
        response = self.client.delete(self.article_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


# Тесты для обработки ошибок
class ArticleErrorHandlingTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_article_not_found(self):
        non_existent_article_url = reverse('article-detail', kwargs={'pk': 999})
        response = self.client.get(non_existent_article_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
