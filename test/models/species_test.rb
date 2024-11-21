# frozen_string_literal: true

require "test_helper"

class SpeciesTest < ActiveSupport::TestCase
  setup do
    @avocado_species = species(:avocado_species)
  end

  test "scientific name can't be empty" do
    @avocado_species.scientific_name = nil

    assert_not  @avocado_species.valid?
    assert_equal "Scientific name can't be blank",  @avocado_species.errors.full_messages.to_sentence
  end

  test "common names can't be blank" do
    @avocado_species.common_names.destroy_all

    assert_not @avocado_species.valid?
    assert_equal "Common names can't be blank", @avocado_species.errors.full_messages.to_sentence
  end

  test "should allow multiple common names" do
    assert_equal 1, @avocado_species.common_names.count

    @avocado_species.common_names.create!(common_name: "Avocado")
    assert @avocado_species.valid?
    assert_equal 2, @avocado_species.common_names.count
  end

  test "should destroy dependent common names when species is destroyed" do
    common_names_count = @avocado_species.common_names.count
    assert_difference -> { SpeciesCommonName.count }, -common_names_count do
      @avocado_species.destroy
    end
  end

  test "accepts nested attributes for common names" do
    new_species = Species.new(
      scientific_name: "Mangifera indica",
      common_names_attributes: [
        { common_name: "Mango" }
      ]
    )

    assert new_species.valid?
  end
end
