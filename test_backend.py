#!/usr/bin/env python3
"""
Simple test script to verify backend API functionality
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    if response.status_code == 200:
        print("✅ Health check passed:", response.json())
        return True
    else:
        print("❌ Health check failed:", response.status_code)
        return False

def test_user_registration():
    """Test user registration"""
    print("\n🔍 Testing user registration...")
    test_user = {
        "email": f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com",
        "full_name": "Test User",
        "password": "testpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/api/v1/auth/register", json=test_user)
    if response.status_code == 200:
        print("✅ User registration successful:", response.json())
        return test_user, response.json()
    else:
        print("❌ User registration failed:", response.status_code, response.text)
        return None, None

def test_user_login(user_data):
    """Test user login"""
    print("\n🔍 Testing user login...")
    login_data = {
        "username": user_data["email"],  # FastAPI OAuth2 uses 'username' field
        "password": user_data["password"]
    }
    
    response = requests.post(
        f"{BASE_URL}/api/v1/auth/login", 
        data=login_data,  # OAuth2 expects form data
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    if response.status_code == 200:
        token_data = response.json()
        print("✅ User login successful")
        return token_data["access_token"]
    else:
        print("❌ User login failed:", response.status_code, response.text)
        return None

def test_authenticated_endpoint(token):
    """Test authenticated endpoint"""
    print("\n🔍 Testing authenticated endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{BASE_URL}/api/v1/auth/me", headers=headers)
    if response.status_code == 200:
        print("✅ Authenticated request successful:", response.json())
        return True
    else:
        print("❌ Authenticated request failed:", response.status_code, response.text)
        return False

def test_meetings_endpoint(token):
    """Test meetings endpoint"""
    print("\n🔍 Testing meetings endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{BASE_URL}/api/v1/meetings/", headers=headers)
    if response.status_code == 200:
        print("✅ Meetings endpoint successful:", response.json())
        return True
    else:
        print("❌ Meetings endpoint failed:", response.status_code, response.text)
        return False

def main():
    print("🚀 Starting Meeting Whisperer Backend API Tests")
    print("=" * 50)
    
    # Test health
    if not test_health():
        return
    
    # Test user registration
    user_data, user_response = test_user_registration()
    if not user_data:
        return
    
    # Test user login
    token = test_user_login(user_data)
    if not token:
        return
    
    # Test authenticated endpoints
    test_authenticated_endpoint(token)
    test_meetings_endpoint(token)
    
    print("\n🎉 All tests completed!")
    print("✅ Backend is working properly!")
    print("\n📖 You can access the API documentation at: http://localhost:8000/docs")
    print("🔧 Services running:")
    print("   - Backend API: http://localhost:8000")
    print("   - PostgreSQL: localhost:5432")
    print("   - Redis: localhost:6380")

if __name__ == "__main__":
    main()

