from django.urls import path
from .views import WebAppCreateView

urlpatterns = [
    path('webapps/', WebAppCreateView.as_view(), name='webapp-list-create')
]
