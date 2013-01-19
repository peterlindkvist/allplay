class List < ActiveRecord::Base
  attr_accessible :name
  has_many :songs

  def as_jon(options={})
    super(options.merge(:include => [:songs]))
  end
end
