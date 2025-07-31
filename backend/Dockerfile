# Start with a base Python image (it's like the operating system + Python pre-installed)
FROM python:3.11-slim-bookworm

# Set the working directory inside the Docker container
# This means all commands after this will run inside /app in the container
WORKDIR /app

# Copy your requirements.txt file from your computer INTO the container's /app folder
COPY requirements.txt .

# Install the Python libraries listed in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy all your other backend code (Python scripts, etc.) from your computer
# INTO the container's /app folder
COPY . .

# Tell Docker what command to run when the container starts
# Replace 'your_analysis_script.py' with the actual name of your main Python script
# Or if you have a Flask app, it might be 'python app.py'
CMD ["python", "app.py"]

# (Optional) If your backend is a web API that listens on a port (e.g., Flask),
# tell Docker which port it exposes. If it's just a script, you can remove this.
# EXPOSE 5000