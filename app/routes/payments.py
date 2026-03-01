from flask import Blueprint, request, jsonify
from ..models.player import Payment
from .. import db

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/payments', methods=['POST'])
def create_payment():
    data = request.get_json()
    new_payment = Payment(
        payer_id=data['payer_id'],
        payee_id=data['payee_id'],
        match_id=data['match_id'],
        payment_date=data['payment_date']
    )
    db.session.add(new_payment)
    db.session.commit()
    return jsonify({'message': 'Payment created successfully'}), 201

@payments_bp.route('/payments', methods=['GET'])
def get_payments():
    payments = Payment.query.all()
    return jsonify([payment.to_dict() for payment in payments]), 200

@payments_bp.route('/payments/<int:payment_id>', methods=['PUT'])
def update_payment(payment_id):
    data = request.get_json()
    payment = Payment.query.get_or_404(payment_id)
    payment.payer_id = data['payer_id']
    payment.payee_id = data['payee_id']
    payment.match_id = data['match_id']
    payment.payment_date = data['payment_date']
    db.session.commit()
    return jsonify({'message': 'Payment updated successfully'}), 200

@payments_bp.route('/payments/<int:payment_id>', methods=['DELETE'])
def delete_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    db.session.delete(payment)
    db.session.commit()
    return jsonify({'message': 'Payment deleted successfully'}), 200