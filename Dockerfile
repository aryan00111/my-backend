# Use official PHP image
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libonig-dev \
    && docker-php-ext-install pdo_mysql mbstring zip

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . .

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Set environment variables (can also set in Render dashboard)
ENV APP_ENV=production
ENV APP_KEY=base64:2j4R+yVjKzvFhW5qO8T+fLkU0M9nQa1T8B5DqJ2cM1U=
ENV DB_CONNECTION=mysql
ENV DB_HOST=mysql.railway.internal
ENV DB_PORT=3306
ENV DB_DATABASE=railway
ENV DB_USERNAME=root
ENV DB_PASSWORD=CQwhdKLqvkAjfBeKTOItAmjlSNpEPsKm

# Expose port
EXPOSE 10000

# Start command: migrate + serve
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=10000