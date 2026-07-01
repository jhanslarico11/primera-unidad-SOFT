FROM php:8.3-cli

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    zip \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Instalar extensiones PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql zip gd

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copiar el proyecto
COPY . .

# Instalar dependencias PHP
RUN composer install --no-dev --optimize-autoloader

# Instalar dependencias de Node
RUN npm install

# Compilar Vite
RUN npm run build

# Permisos y carpetas necesarias para Laravel
RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=${PORT:-10000}
