# frozen_string_literal: true

require "test_helper"

class SpeciesTest < ActiveSupport::TestCase
  setup do
    @cashew_species = species(:cashew)
  end

  test "scientific name can't be empty" do
    @cashew_species.scientific_name = nil

    assert_not  @cashew_species.valid?
    assert_equal "Scientific name can't be blank",  @cashew_species.errors.full_messages.to_sentence
  end

  test "common names can't be blank" do
    @cashew_species.common_names.destroy_all

    assert_not @cashew_species.valid?
    assert_equal "Common names can't be blank", @cashew_species.errors.full_messages.to_sentence
  end

  test "should allow multiple common names" do
    assert_equal 1, @cashew_species.common_names.count

    @cashew_species.common_names.create!(common_name: "Caju")
    assert @cashew_species.valid?
    assert_equal 2, @cashew_species.common_names.count
  end

  test "parameter can't be blank" do
    @cashew_species.functions.destroy_all

    assert_not @cashew_species.valid?
    assert_includes @cashew_species.errors.full_messages.to_sentence, "Parameters can't be blank"
  end

  test "should allow multiple parameters for different functions" do
    assert_difference -> { @cashew_species.parameters.count } do
      new_function = species_functions(:forage)
      @cashew_species.parameters.create!(
        species_function: new_function,
        layer: :low_layer,
        first_crop_time: 3.0,
        productive_life: 25.0,
        max_height: 8.0,
        spacing: 6.0,
        accepts_pruning: true,
        fertility_requirement: :medium_fertility,
        water_requirement: :medium_water
      )
    end

    assert @cashew_species.valid?
  end

  test "should not allow duplicate functions" do
    existing_function = @cashew_species.parameters.first.species_function
    new_parameter = @cashew_species.parameters.build(
      species_function: existing_function,
      layer: :low_layer,
      first_crop_time: 3.0,
      productive_life: 25.0,
      max_height: 8.0,
      spacing: 6.0,
      accepts_pruning: true,
      fertility_requirement: :medium_fertility,
      water_requirement: :medium_water
    )

    assert_not @cashew_species.valid?
    assert_includes @cashew_species.errors.full_messages.to_sentence, "Cannot have multiple parameter sets for the same function"
  end

  test "should destroy dependent parameters when species is destroyed" do
    parameters_count = @cashew_species.parameters.count
    assert_difference -> { SpeciesParameter.count }, -parameters_count do
      @cashew_species.destroy
    end
  end

  test "should destroy dependent common names when species is destroyed" do
    common_names_count = @cashew_species.common_names.count
    assert_difference -> { SpeciesCommonName.count }, -common_names_count do
      @cashew_species.destroy
    end
  end

  test "accepts nested attributes for parameters" do
    new_species = Species.new(
      scientific_name: "Mangifera indica",
      common_names_attributes: [
        { common_name: "Mango" }
      ],
      parameters_attributes: [
        {
          species_function_id: species_functions(:fruit).id,
          layer: :low_layer,
          first_crop_time: 5.0,
          productive_life: 50.0,
          max_height: 12.0,
          spacing: 10.0,
          accepts_pruning: true,
          fertility_requirement: :medium_fertility,
          water_requirement: :medium_water
        }
      ]
    )

    assert new_species.valid?
  end
end
