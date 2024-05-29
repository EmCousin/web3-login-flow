class ApplicationController < ActionController::Base
  include Authenticated
  include Authentication

  before_action :authenticate!, unless: :public_controller?

  def public_controller?
    self.class <= PublicController
  end
end
