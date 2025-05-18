class AddRowSpacingToProjects < ActiveRecord::Migration[7.2]
  def change
    add_column :projects, :row_spacing, :integer, :default => 1
  end
end
