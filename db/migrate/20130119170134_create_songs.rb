class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :url
      t.string :title
      t.string :artist
      t.integer :duration
      t.integer :list_id

      t.timestamps
    end
  end
end
