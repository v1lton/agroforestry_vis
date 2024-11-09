# frozen_string_literal: true

class SpeciesFunctionsController < ApplicationController
  before_action :set_species_function, only: %i[ show edit update destroy ]

  # GET /species_functions/timeline
  def timeline
    @species_functions = SpeciesFunction.order(:name)
    @species_parameters = []
    if params[:species_function_id].present?
      @selected_function = SpeciesFunction.find(params[:species_function_id])
      @species_parameters = SpeciesParameter.includes(:species)
                                            .select('species_parameters.*, species.scientific_name as species_scientific_name')
                                            .joins(:species)
                                            .where(species_function: @selected_function)
    end

    respond_to do |format|
      format.html
      format.json { render json: @species_parameters.as_json(
        only: [:first_crop_time, :productive_life, :species_scientific_name],
      )
      }
    end
  end

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