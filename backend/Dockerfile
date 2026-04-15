FROM ruby:3.3.3-alpine

WORKDIR /app

RUN apk add --no-cache build-base postgresql-dev nodejs npm tzdata git bash postgresql-client

COPY Gemfile Gemfile.lock* ./
RUN bundle install

COPY . .

COPY bin/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
