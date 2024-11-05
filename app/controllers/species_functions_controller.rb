# frozen_string_literal: true

class SpeciesFunctionsController < ApplicationController
  before_action :set_species_function, only: %i[ show edit update destroy ]

  # GET /functions
  def index
    @species_functions = SpeciesFunction.all
  end

  # GET /functions/1
  def show
  end

  # GET /functions/new
  def new
    @species_function = SpeciesFunction.new
  end

  # GET /functions/1/edit
  def edit
  end

  # POST /functions
  def create
    @species_function = SpeciesFunction.new(species_function_params)

    if @species_function.save
      redirect_to @species_function, notice: "Function was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @species_function.update(species_function_params)
      redirect_to @species_function, notice: "Function was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @species_function.destroy!

    redirect_to species_functions_path, status: :see_other, notice: "Function was successfully destroyed."
  end

  private

  def set_species_function
    @species_function = SpeciesFunction.find(params[:id])
  end

  def species_function_params
    params.require(:species_function).permit("name")
  end
end