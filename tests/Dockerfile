FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy test files
COPY . .

# Create directory for reports
RUN mkdir -p report

CMD ["pytest", "-v"]
