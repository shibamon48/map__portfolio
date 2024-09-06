class UserSessionsController < ApplicationController
  def new
  end

  def create
    @user = login(params[:email], params[:password])

    if @user
      flash[:success] = "Login successful"
      redirect_to :map
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
