class CreateSpots < ActiveRecord::Migration[7.2]
  def change
    create_table :spots do |t|
      t.float :latitude, null: false
      t.float :longitude, null: false
      t.references :user, null: false, foreign_key: true
      t.string :photo
      t.string :name, null: false
      t.text :review

      t.timestamps
    end
  end
end
