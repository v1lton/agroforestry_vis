require "test_helper"

class SpeciesTest < ActiveSupport::TestCase

  test "scientific name can't be empty" do
    species = Species.new

    assert_not species.valid?
    assert_equal "Scientific name can't be blank", species.errors.full_messages.to_sentence
  end
end
