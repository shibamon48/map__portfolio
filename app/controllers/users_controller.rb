class UsersController < ApplicationController
  skip_before_action :require_login, only: %i[ new create ]
  before_action :set_user, only: %i[ edit update destroy ]

  def new
    @user = User.new
  end

  def edit
  end

  def create
    @user = User.new(user_params)

      if @user.save!
        flash[:success] = "成功しました！"
        redirect_to new_route_path
      else
        flash.now[:error] = "ログインに失敗しました。"
        render :new, status: :unprocessable_entity
      end
  end

  def update
      if @user.update(user_params)
        flash[:success] = "更新しました！"
        redirect_to edit_user_path(@user)
      else
        flash.now[:error] = "更新に失敗しました。"
        render :edit, status: :unprocessable_entity
      end
  end

  def destroy
    @user.destroy!

    respond_to do |format|
      format.html { redirect_to users_url, notice: "User was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end
end
