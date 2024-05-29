module Authentication
  private

  def authenticate!
    authenticate
    head :unauthorized unless Current.user
  end

  def authenticate
    return unless session[:user_id]

    user = User.find_by(id: session[:user_id])
    Current.user = user
  end

  def sign_in(user)
    session[:user_id] = user.id
    Current.user = user
  end

  def sign_out
    session.delete(:user_id)
    Current.reset
  end
end
