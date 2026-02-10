# Lost & Found Item Tracker: Local Setup Guide

## Prerequisites (Install These First)

1. **Python 3.10+**  
[https://www.python.org/downloads/](https://www.python.org/downloads/)
2. **Node.js (LTS)**  
[https://nodejs.org](https://nodejs.org)
 (npm installs automatically with Node)
 3. **PostgreSQL**  
[https://www.postgresql.org/download/](https://www.postgresql.org/download/)


## Step  1 - Clone the Repository
```bash
git clone https://github.com/AlexMarkoutsis/lost-found-item-tracker
cd lost-found-item-tracker
```


## Backend Setup (Django)

### Step 2 - Create Virtual Environment
```bash
cd backend
python -m venv venv
```

### Activate it:

Windows:
```bash
venv\Scripts\activate
```
Mac/Linux:
```bash
source venv/bin/activate
```

### Step 3 - Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### Step 4 - Configure Database
Every user must create a PostgreSQL database locally. For example:
```py
# Found in backend/config/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_db_name',			# Change this
        'USER': 'postgres',				# May need to be changed
        'PASSWORD': 'your_password',	# Change this
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Step 5 - Run Migrations
```bash
python manage.py migrate
```

### Step 6 - Run Backend Server
```bash
python manage.py runserver
```
The backend will run at:
```cpp
http://127.0.0.1:8000
```


## Frontend Setup (React w/ JavaScript)
Go back to the project root:
```bash
cd ..
cd frontend
```

### Step  7 - Install Frontend Dependencies
```bash
npm install
```

### Step 8 - Start Frontend
```bash
npm run dev
```
Frontend runs at:
```arduino
http://localhost:5173
```


## Additional Information
### If dependencies change, the following commands must be run:

In lost-found-item-tracker / backend /:
```bash
pip install -r requirements.txt
python manage.py migrate
```

In lost-found-item-tracker / frontend /:
```bash
pip install -r requirements.txt
```

### Machine-Specific Files
The following are machine-specific and should not be committed:
* backend/venv/
* frontend/node_modules
* .env filles
* Local PostgreSQL databases

### Adding Python Packages
When a python package is added, run:
```bash
pip freeze > requirements.txt
```

### Adding npm Packages
When an npm package is added, commit the updated package.json file to GitHub

### Changing the Database/Models
If the models are changed, commit the migrations folder and let the team know. All team members will need to run ```migrate ```
