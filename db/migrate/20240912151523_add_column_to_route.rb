class AddColumnToRoute < ActiveRecord::Migration[7.2]
  def change
    change_table :routes do |t|
      t.references :user, null: false, foreign_key: true
    end
  end
end
