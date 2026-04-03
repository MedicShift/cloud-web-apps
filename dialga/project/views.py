# views.py
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User


def admin_login(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        user = authenticate(request, username=email, password=password)

        if user:
            login(request, user)
            return redirect("admin_dashboard")

    return render(request, "admin/login.html")


def admin_register(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        if not User.objects.filter(username=email).exists():
            User.objects.create_user(username=email, email=email, password=password)
            return redirect("admin_login")

    return render(request, "admin/register.html")


def admin_dashboard(request):
    return render(request, "admin/dashboard.html")

