# frozen_string_literal: true

require "test_helper"

class SpeciesFunctionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @fruit_function = species_functions(:fruit)
  end

  test "should get index" do
    get species_functions_path
    assert_response :success
  end

  test "should get new" do
    get new_species_function_path
    assert_response :success
  end

  test "should create species function" do
    assert_difference("SpeciesFunction.count") do
      post species_functions_path, params: {
        species_function: {
          name: "Wood tree"
        }
      }
    end

    assert_redirected_to species_function_path(SpeciesFunction.last)
  end

  test "should show species function" do
    get species_function_path(@fruit_function)
    assert_response :success
  end

  test "should get edit" do
    get edit_species_function_path(@fruit_function)
    assert_response :success
  end

  test "should update species" do
    patch species_function_path(@fruit_function), params: {species_function: {name: "Fruit tree"}}
    assert_redirected_to species_function_path(@fruit_function)
  end

  test "should destroy species function" do
    assert_difference("SpeciesFunction.count", -1) do
      delete species_function_path(@fruit_function)
    end

    assert_redirected_to species_functions_path
  end
end