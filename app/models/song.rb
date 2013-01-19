class Song < ActiveRecord::Base
  attr_accessible :artist, :duration, :list_id, :title, :url
  belongs_to :list
end
