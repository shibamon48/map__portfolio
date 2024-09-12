class CreateRoutes < ActiveRecord::Migration[7.2]
  def change
    create_table :routes do |t|
      t.string :path

      t.timestamps
    end
  end
end
