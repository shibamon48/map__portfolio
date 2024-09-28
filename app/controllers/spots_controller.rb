class SpotsController < ApplicationController
  def new
    @spot = Spot.new
  end

  def save_spot_data
    @spot = Spot.new(spot_params)

    if @spot.save!
      render json: { message: 'データが保存されました', spot: @spot }, status: :ok
    end
  end

  def get_spot_data
    @spot = Spot.find_by(latitude: params[:lat], longitude: params[:lng])
    if @spot
      render json: @spot, status: :ok
    else
      render json: { message: "Not Found" }, status: :not_found
    end
  end

  private
  def spot_params
    params.permit(:latitude, :longitude, :photo, :name, :review).merge(user_id: current_user.id)
  end
end
