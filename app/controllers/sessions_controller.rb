class SessionsController < ApplicationController
  include PublicController

  def create
    message = params.require(:message)
    *_, nonce = message.split("Nonce: ")
    address = verify_nonce(nonce)
    signature = params.require(:signature)

    if verify_signature(address, message, signature)
      user = User.find_or_create_by(wallet_address: address)
      sign_in(user)

      head :created
    else
      render json: { error: 'Invalid signature' }, status: :unauthorized
    end
  end

  def destroy
    sign_out
    head :no_content
  end

  private

  def verify_nonce(nonce)
    verifier = ActiveSupport::MessageVerifier.new(Rails.application.secret_key_base)
    verified_message = verifier.verify(nonce)
    address, _timestamp = verified_message.split('|')
    address
  end

  def verify_signature(address, message, signature)
    eth_personal_sign_prefix = "\x19Ethereum Signed Message:\n#{message.length}"
    message_hash = Eth::Util.keccak256(eth_personal_sign_prefix + message)
    public_key = Eth::Signature.personal_recover(message, signature)
    recovered_address = Eth::Util.public_key_to_address(public_key)

    recovered_address.to_s.downcase == address.downcase
  end
end
