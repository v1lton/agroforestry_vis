class CreateProjects < ActiveRecord::Migration[7.2]
  def change
    create_table :projects do |t|
      t.string :title
      t.integer :width
      t.integer :height

      t.timestamps
    end
  end
end
