class CreateExplorationRoutes < ActiveRecord::Migration[7.2]
  def change
    create_table :exploration_routes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :route, null: false, foreign_key: true

      t.timestamps
    end
  end
end
