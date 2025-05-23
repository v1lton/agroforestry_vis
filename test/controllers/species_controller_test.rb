# frozen_string_literal: true

require "test_helper"

class SpeciesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @species = species(:avocado_species)
  end

  test "should get index" do
    get species_index_url
    assert_response :success
  end

  test "should get new" do
    get new_species_url
    assert_response :success
  end

  test "should create species" do
    assert_difference("Species.count") do
      post species_index_url, params: { species: {
        scientific_name: "Malpihia glabra L.",
        layer: :high_layer,
        start_crop_time: 3,
        end_crop_time: 15,
        max_height: 5,
        common_names_attributes: [{ common_name: "Acerola" }],
      }}
    end

    assert_redirected_to species_url(Species.last)
  end

  test "should show species" do
    get species_url(@species)
    assert_response :success
  end

  test "should get edit" do
    get edit_species_url(@species)
    assert_response :success
  end

  test "should update species" do
    patch species_url(@species), params: { species: { scientific_name: @species.scientific_name } }
    assert_redirected_to species_url(@species)
  end

  test "should destroy species" do
    assert_difference("Species.count", -1) do
      delete species_url(@species)
    end

    assert_redirected_to species_index_url
  end
end
