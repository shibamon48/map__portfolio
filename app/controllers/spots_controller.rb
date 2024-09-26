class SpotsController < ApplicationController
  def new
    @spot = Spot.new
  end

  def save_spot_data
    @spot = Spot.new(spot_params)

    if @spot.save!
      render json: @pin, status: :ok
    end
  end

  def get_spot_data
  end

  private
  def spot_params
    params.permit(:latitude, :longitude, :photo, :name, :review).merge(user_id: current_user.id)
  end
end
