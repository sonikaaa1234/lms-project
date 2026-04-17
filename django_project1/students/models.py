from django.db import models

class Student(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    email = models.EmailField()
    marka=models.IntegerField(default=0)
    markb=models.IntegerField(default=0)
    markc=models.IntegerField(default=0)

    def __str__(self):
        return self.name