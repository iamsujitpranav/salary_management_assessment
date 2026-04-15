FROM ruby:3.3.3-alpine

WORKDIR /app

RUN apk add --no-cache build-base postgresql-dev nodejs npm tzdata git bash

COPY Gemfile Gemfile.lock* ./
RUN bundle install

COPY . .

EXPOSE 3000
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
