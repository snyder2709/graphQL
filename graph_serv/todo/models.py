from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.


class Todo(models.Model):
    user = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, default=1)
    title = models.CharField(max_length=150)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id}--{self.title}"
