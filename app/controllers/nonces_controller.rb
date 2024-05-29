class NoncesController < ApplicationController
  include PublicController
  skip_before_action :verify_authenticity_token, only: [:create]

  def create
    verifier = ActiveSupport::MessageVerifier.new(Rails.application.secret_key_base)
    message = [params.require(:address), Time.current.to_s].join('|')
    nonce = verifier.generate(message)
    render json: { nonce: nonce }
  end
end
