class SpeciesController < ApplicationController
  before_action :set_species, only: %i[ show edit update destroy ]

  # GET /species or /species.json
  def index
    @species = Species.all
  end

  # GET /species/1 or /species/1.json
  def show
  end

  # GET /species/new
  def new
    @species = Species.new
  end

  # GET /species/1/edit
  def edit
  end

  # POST /species or /species.json
  def create
    @species = Species.new(species_params)

    respond_to do |format|
      if @species.save
        format.html { redirect_to @species, notice: "Species was successfully created." }
        format.json { render :show, status: :created, location: @species }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @species.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /species/1 or /species/1.json
  def update
    respond_to do |format|
      if @species.update(species_params)
        format.html { redirect_to @species, notice: "Species was successfully updated." }
        format.json { render :show, status: :ok, location: @species }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @species.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /species/1 or /species/1.json
  def destroy
    @species.destroy!

    respond_to do |format|
      format.html { redirect_to species_index_path, status: :see_other, notice: "Species was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_species
      @species = Species.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
  def species_params
    params.require(:species).permit(
      :scientific_name,
      species_parameters_attributes: [
        :species_function_id,
        :layer,
        :first_crop_time,
        :productive_life,
        :max_height,
        :spacing,
        :accepts_pruning,
        :fertility_requirement,
        :water_requirement
      ]
    )
  end
end
