rake assets:precompile
cp public/assets/application.js public/static/application.js
cp public/assets/application.css public/static/application.css
rake assets:clean

git push heroku master