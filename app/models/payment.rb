class Payment < ApplicationRecord
  belongs_to :user
  attr_accessor :card_number, :card_cvv, :card_expires_month, :card_expires_year


  def self.month_options
    Date::MONTHNAMES.compact.each_with_index.map {|name, i| ["#{i+1} - #{name}", i+1 ]}
  end

  def self.year_option
    (Date.today.year..(Date.today.year+10)).to_a
  end

  def process_payment
    customer = Stripe::Customer.create email: email, card: token

    Stripe::Charge.create customer: customer.id, amount: 1000, description: 'premium', currency: 'usd'
  end

end
