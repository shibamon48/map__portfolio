class RemovePhotoFromSpots < ActiveRecord::Migration[7.2]
  def change
    remove_column :spots, :photo, :string
  end
end
