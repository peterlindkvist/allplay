class List < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, use: :slugged

  attr_accessible :name
  has_many :songs

  def as_jon(options={})
    super(options.merge(:include => [:songs]))
  end
end
