class AddArtwork < ActiveRecord::Migration
  def change
    add_column :songs, :img, :string
  end
end
