class UserSessionsController < ApplicationController
  skip_before_action :require_login, only: %i[ new create ]
  def new
  end

  def create
    @user = login(params[:email], params[:password])

    if @user
      flash[:success] = "ログインしました！"
      redirect_to new_route_path
    else
      flash.now[:error] = "Login failed"
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    logout
    flash[:error] = "ログアウトしました!"
    redirect_to root_path, status: :see_other
  end
end
