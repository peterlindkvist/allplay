class Song < ActiveRecord::Base
  attr_accessible :author, :duration, :list_id, :title, :url, :playertype, :img
  belongs_to :list
end
