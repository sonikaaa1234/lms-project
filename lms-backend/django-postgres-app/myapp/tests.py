from django.test import TestCase
from .models import YourModel

class YourModelTests(TestCase):

    def setUp(self):
        # Set up any initial data for the tests
        YourModel.objects.create(field_name='test_value')

    def test_model_str(self):
        # Test the string representation of the model
        instance = YourModel.objects.get(field_name='test_value')
        self.assertEqual(str(instance), 'expected_string_representation')

    def test_model_field(self):
        # Test a specific field in the model
        instance = YourModel.objects.get(field_name='test_value')
        self.assertEqual(instance.field_name, 'test_value')