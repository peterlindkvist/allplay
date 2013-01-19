class Song < ActiveRecord::Base
  attr_accessible :author, :duration, :list_id, :title, :url, :playertype
  belongs_to :list
end
