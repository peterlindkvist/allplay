class UpdateSong < ActiveRecord::Migration
  def up
    remove_column :songs, :artist
    add_column :songs, :author, :string
    add_column :songs, :playertype, :string
  end

  def down
    add_column :songs, :artist, :string
    remove_column :songs, :author
    remove_column :songs, :playertype
  end
end
