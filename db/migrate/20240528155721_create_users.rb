class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :wallet_address, null: false

      t.timestamps
    end
    add_index :users, :wallet_address, unique: true
  end
end
