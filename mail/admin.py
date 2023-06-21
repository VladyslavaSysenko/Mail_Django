from django.contrib import admin

from .models import User, Email

# Models
admin.site.register(User)
admin.site.register(Email)
