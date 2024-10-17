FROM ruby:3.2.2-slim

# Install essential Linux packages
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs \
    git \
    curl

# Set working directory
WORKDIR /app

# Install Rails
RUN gem install rails

# Copy Gemfile and install dependencies
COPY Gemfile* .
RUN bundle install

# Copy the main application
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the main process
CMD ["rails", "server", "-b", "0.0.0.0"]