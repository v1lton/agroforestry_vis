class AddUniqueConstraints < ActiveRecord::Migration[7.2]
  def change
    # Ensure scientific_name in species is unique
    add_index :species, :scientific_name, unique: true
  end
end
